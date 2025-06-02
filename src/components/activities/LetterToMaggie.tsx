"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PartyPopper, Send } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { sendEmail, EMAIL_TEMPLATES } from "@/utils/titanEmailUtils"

const LetterToMaggie = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please tell us your name so Maggie knows who you are!")
      return
    }

    if (!message.trim()) {
      toast.error("Please write a message for Maggie!")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare email data - UPDATED FIELD NAMES to match PHP expectations
      const emailData = {
        from_name: name,
        sender_email: email || "No email provided",
        message: message,
      }

      // Send the message using our email utility
      const result = await sendEmail(EMAIL_TEMPLATES.LETTER_TO_MAGGIE, emailData)

      if (result.success) {
        // Show success message
        toast.success("Your letter is on its way to Maggie!", {
          description: "She'll be so excited to read it!",
        })

        setShowSuccess(true)

        // Reset form
        setName("")
        setEmail("")
        setMessage("")
      } else {
        throw new Error(result.error || "Failed to send letter to Maggie")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("There was a problem sending your letter to Maggie. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <img
          src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png"
          alt="Maggie Logo"
          className="w-32 h-32 object-contain rounded-full border-4 border-purple-200 shadow-lg mb-4"
        />
      </div>

      <Card id="write-to-maggie" className="transition-all duration-300 hover:shadow-lg overflow-hidden scroll-mt-24">
        <CardHeader className="flex items-center bg-gradient-to-r from-purple-100 to-pink-100">
          <div className="p-3 rounded-full bg-purple-200 mb-4">
            <PartyPopper className="h-10 w-10 text-purple-600" />
          </div>
          <CardTitle className="text-3xl font-['Comic_Neue'] text-center">Write to Maggie</CardTitle>
          <CardDescription className="text-lg text-center">
            Send a special letter to Maggie and she might write back!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">
                Your Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should Maggie call you?"
                required
                className="border-2 border-purple-200 focus:border-purple-400 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">
                Parent's Email (optional)
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="If you want Maggie to write back"
                className="border-2 border-purple-200 focus:border-purple-400 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-lg">
                Your Message to Maggie
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would you like to tell Maggie?"
                required
                className="min-h-[120px] border-2 border-purple-200 focus:border-purple-400 text-lg"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-6 bg-gradient-to-r from-purple-100 to-pink-100">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-lg py-6"
          >
            <Send size={20} />
            {isSubmitting ? "Sending letter..." : "Send Letter to Maggie"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-purple-50 border-purple-200">
          <DialogHeader>
            <DialogTitle className="font-['Comic_Neue'] text-2xl text-purple-800">
              Your Letter is on its way!
            </DialogTitle>
            <DialogDescription className="text-lg">
              Thanks for writing to Maggie! She loves getting mail from her friends.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <img
              src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png"
              alt="Maggie with a letter"
              className="w-1/2 rounded-lg shadow-md"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccess(false)} className="bg-purple-600 hover:bg-purple-700 text-lg">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LetterToMaggie

