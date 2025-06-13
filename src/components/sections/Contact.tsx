
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { isDevelopmentMode } from "@/utils/environmentUtils"

const Contact = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill out all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Sending contact form with data:", {
        name,
        email,
        subject: subject || "Contact Form Submission",
        message,
      })

      // Development mode - store in localStorage
      if (isDevelopmentMode) {
        const timestamp = new Date().toISOString()
        const contactId = `contact_${timestamp}_${Math.random().toString(36).substring(2, 9)}`

        // Get existing contacts from localStorage
        const existingContacts = localStorage.getItem("contactSubmissions")
          ? JSON.parse(localStorage.getItem("contactSubmissions") || "[]")
          : []

        // Add new contact to the list
        const updatedContacts = [
          {
            id: contactId,
            name,
            email,
            subject: subject || "Contact Form Submission",
            message,
            timestamp,
          },
          ...existingContacts,
        ]

        // Save back to localStorage
        localStorage.setItem("contactSubmissions", JSON.stringify(updatedContacts))

        console.log("Contact form saved to localStorage (development mode)")

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        toast.success("Message sent! We'll get back to you soon.")

        // Reset form
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      }
      // Production mode - send to PHP backend
      else {
        // Create FormData object
        const formData = new FormData()
        formData.append("name", name)
        formData.append("email", email)
        formData.append("subject", subject || "Contact Form Submission")
        formData.append("message", message)

        // Send to PHP backend
        const response = await fetch("/api/contact.php", {
          method: "POST",
          body: formData,
        })

        // Check if the response is JSON
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json()

          console.log("Contact form response:", result)

          if (result.success) {
            toast.success("Message sent! We'll get back to you soon.")

            // Reset form
            setName("")
            setEmail("")
            setSubject("")
            setMessage("")
          } else {
            throw new Error(result.message || "Failed to send message")
          }
        } else {
          // Handle non-JSON response
          const textResponse = await response.text()
          console.error("Received non-JSON response:", textResponse)
          throw new Error("Received invalid response from server")
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("There was a problem sending your message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-indigo-600 font-['Comic_Neue']">
            Get In Touch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Contact Information</h3>
              <p className="text-gray-600 mb-6">
                Have questions about Maggie's books, scheduling a reading, or anything else? Feel free to reach out!
                We'd love to hear from you.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-800">Email:</h4>
                  <p className="text-indigo-600">maggie@booksbymaggie.com</p>
                </div>
                {/* Phone number removed as requested */}
                <div>
                  <h4 className="font-bold text-gray-800">Social Media:</h4>
                  <div className="flex space-x-4 mt-2">
                    <a href="https://www.facebook.com/profile.php?id=61577214954344" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/nmpettus" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.073-4.948 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a href="https://x.com/nmpettus" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
                <Input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full"
                />
                <Textarea
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full"
                  required
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
