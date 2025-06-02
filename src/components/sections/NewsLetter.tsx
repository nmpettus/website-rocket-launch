"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { isDevelopmentMode } from "@/utils/environmentUtils"

interface Subscriber {
  email: string
  date: string
}

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load subscribers from localStorage on component mount
  useEffect(() => {
    const savedSubscribers = localStorage.getItem("newsletter-subscribers")
    if (savedSubscribers) {
      try {
        setSubscribers(JSON.parse(savedSubscribers))
      } catch (e) {
        console.error("Error parsing subscribers:", e)
      }
    }
  }, [])

  // Function to clear localStorage subscribers (for testing)
  const clearLocalStorageSubscribers = () => {
    if (isDevelopmentMode) {
      localStorage.removeItem("newsletter-subscribers")
      setSubscribers([])
      toast.success("Local subscribers cleared")
    }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Sending newsletter subscription request for:", email)

      // Development mode - store in localStorage
      if (isDevelopmentMode) {
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Get existing subscribers from localStorage
        const savedSubscribers = localStorage.getItem("newsletter-subscribers")
        const subscribers: Subscriber[] = savedSubscribers ? JSON.parse(savedSubscribers) : []

        // Check if already subscribed
        if (subscribers.some((sub) => sub.email === email)) {
          toast.info("This email is already subscribed to our newsletter!")
          setIsSubmitting(false)
          return
        }

        // Add new subscriber
        const newSubscriber = {
          email,
          date: new Date().toISOString(),
        }

        // Save to localStorage
        localStorage.setItem("newsletter-subscribers", JSON.stringify([...subscribers, newSubscriber]))

        toast.success("Thank you for subscribing to our newsletter!")
        setEmail("")
      }
      // Production mode - send to PHP backend
      else {
        // Create FormData object
        const formData = new FormData()
        formData.append("email", email)
        formData.append("force_new", "true") // Add this to force a new subscription

        // Send to PHP backend
        const response = await fetch("/api/newsletter.php", {
          method: "POST",
          body: formData,
        })

        // Check if the response is JSON
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json()

          console.log("Newsletter subscription response:", result)

          if (result.success) {
            toast.success("Thank you for subscribing to our newsletter!")
            setEmail("")
          } else if (result.message && result.message.includes("already subscribed")) {
            toast.info("This email is already subscribed to our newsletter!")
          } else {
            throw new Error(result.message || "Failed to process subscription")
          }
        } else {
          // Handle non-JSON response
          const textResponse = await response.text()
          console.error("Received non-JSON response:", textResponse)
          throw new Error("Received invalid response from server")
        }
      }
    } catch (error) {
      console.error("Error saving subscription:", error)
      toast.error("Unable to save your subscription. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="newsletter" className="py-16 bg-indigo-600 text-white scroll-mt-28">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-6 font-['Comic_Neue']">Join Our Reading Family</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Sign up for our free newsletter to get updates on new releases, special giveaways, and Maggie's latest
          adventures!
        </p>

        <form className="max-w-md mx-auto" onSubmit={handleSubscribe}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="bg-amber-500 hover:bg-yellow-600 text-white font-bold rounded-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          <p className="text-sm mt-3 text-indigo-100">We respect your privacy. Unsubscribe at any time.</p>
        </form>

        {isDevelopmentMode && (
          <div className="mt-4">
            <button
              onClick={clearLocalStorageSubscribers}
              className="text-xs underline text-indigo-200 hover:text-white"
            >
              Clear Local Subscribers (Dev Only)
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Newsletter
