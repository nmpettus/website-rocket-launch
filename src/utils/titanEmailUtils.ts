// Import the environment detection from our utility
import { isDevelopmentMode } from "./environmentUtils"

// Email templates/endpoints
export const EMAIL_TEMPLATES = {
  CONTACT: "contact",
  NEWSLETTER: "newsletter",
  LETTER_TO_MAGGIE: "letter-to-maggie",
}

// API endpoints for each email type
const API_ENDPOINTS = {
  CONTACT: "/api/contact.php",
  NEWSLETTER: "/api/newsletter.php",
  LETTER_TO_MAGGIE: "/api/letter-to-maggie.php",
}

/**
 * Send email using PHP backend
 */
export const sendEmail = async (template: string, data: Record<string, any>, recipientEmail?: string) => {
  // Use development mode (localStorage) when in development
  if (isDevelopmentMode) {
    return sendDevelopmentEmail(template, data, recipientEmail)
  }
  // Use PHP backend in production
  else {
    return sendProductionEmail(template, data, recipientEmail)
  }
}

/**
 * Development email system using localStorage
 * This is only used during local development
 */
const sendDevelopmentEmail = async (template: string, data: Record<string, any>, recipientEmail?: string) => {
  try {
    // Create a timestamp for the email
    const timestamp = new Date().toISOString()
    const emailId = `email_${timestamp}_${Math.random().toString(36).substring(2, 9)}`

    // Prepare the email data
    const emailData = {
      id: emailId,
      template,
      data,
      recipientEmail,
      timestamp,
    }

    // Get existing emails from localStorage
    const existingEmails = localStorage.getItem("sentEmails")
      ? JSON.parse(localStorage.getItem("sentEmails") || "[]")
      : []

    // Add new email to the list
    const updatedEmails = [emailData, ...existingEmails]

    // Save back to localStorage
    localStorage.setItem("sentEmails", JSON.stringify(updatedEmails))

    // Log the email (for development purposes)
    console.log("Email sent (development mode):", {
      template,
      data,
      recipientEmail,
    })

    return { success: true, messageId: emailId }
  } catch (error) {
    console.error("Error sending email (development mode):", error)
    return { success: false, error }
  }
}

/**
 * Production email system that uses PHP backend
 */
const sendProductionEmail = async (template: string, data: Record<string, any>, recipientEmail?: string) => {
  try {
    // Determine which API endpoint to use based on the template name
    let endpoint = ""
    switch (template) {
      case EMAIL_TEMPLATES.CONTACT:
        endpoint = API_ENDPOINTS.CONTACT
        break
      case EMAIL_TEMPLATES.NEWSLETTER:
        endpoint = API_ENDPOINTS.NEWSLETTER
        break
      case EMAIL_TEMPLATES.LETTER_TO_MAGGIE:
        endpoint = API_ENDPOINTS.LETTER_TO_MAGGIE
        break
      default:
        throw new Error(`Unknown email template: ${template}`)
    }

    // Prepare form data for the PHP endpoint
    const formData = new FormData()

    // Add all data fields to the form data
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    // Add recipient email if provided
    if (recipientEmail) {
      formData.append("email", recipientEmail)
    }

    console.log(`Sending email via PHP backend: ${endpoint}`, data)

    // Send request to PHP endpoint
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })

    // Parse the response
    const result = await response.json()

    console.log("PHP Backend Response:", result)

    if (result.success) {
      return {
        success: true,
        messageId: result.messageId || `php_${Date.now()}`,
        ...result,
      }
    } else {
      throw new Error(result.message || "Unknown error occurred")
    }
  } catch (error) {
    console.error("Error sending email (production mode):", error)

    // Add more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Check if we're in development mode
export const isEmailConfigValid = () => {
  return !isDevelopmentMode // Always valid in production, as we're using PHP backend
}

