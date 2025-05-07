import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema } from "@shared/schema";
import fetch from "node-fetch";

// Discord webhook URL - in production this would be in an environment variable
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1369614118184816642/Vmk1oXGafBW7RtzSeZOkr2n6j771svKi5MOlSrRrcc7jTnfI5lQsdtEF9xZ2Am2DF3qK";

// Map to store last submission time by username
const submissionTimestamps = new Map<string, number>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Application submission endpoint
  app.post("/api/application", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validationResult = insertApplicationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid application data", 
          errors: validationResult.error.errors 
        });
      }
      
      const applicationData = validationResult.data;
      const username = applicationData.username;
      const ipAddress = req.ip || req.connection.remoteAddress || "unknown";
      
      // Check rate limit for this specific username
      const lastSubmissionTime = submissionTimestamps.get(username);
      const currentTime = Date.now();
      const fifteenMinutesInMs = 15 * 60 * 1000;
      
      if (lastSubmissionTime && currentTime - lastSubmissionTime < fifteenMinutesInMs) {
        const timeRemaining = Math.ceil((lastSubmissionTime + fifteenMinutesInMs - currentTime) / 60000);
        return res.status(429).json({ 
          message: `Rate limit exceeded for this username. Please try again in ${timeRemaining} minute${timeRemaining === 1 ? '' : 's'}.` 
        });
      }
      
      // Store application in our database
      const application = await storage.createApplication({
        ...applicationData,
        ipAddress
      });
      
      // Send to Discord webhook
      const webhookData = {
        embeds: [{
          title: "New Moderator Application",
          color: 0x23A55A,
          fields: [
            {
              name: "Discord Username",
              value: applicationData.username,
              inline: true
            },
            {
              name: "Timezone",
              value: applicationData.timezone,
              inline: true
            },
            {
              name: "Activity Level",
              value: applicationData.activityLevel,
              inline: true
            },
            {
              name: "Professionalism (1-10)",
              value: applicationData.professionalism.toString(),
              inline: true
            },
            {
              name: "About",
              value: applicationData.about
            },
            {
              name: "Why Join",
              value: applicationData.whyJoin
            },
            {
              name: "Joke",
              value: applicationData.joke
            }
          ],
          timestamp: new Date().toISOString()
        }]
      };
      
      try {
        const webhookResponse = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });
        
        if (!webhookResponse.ok) {
          console.error("Discord webhook error:", await webhookResponse.text());
        }
      } catch (webhookError) {
        console.error("Failed to send to Discord webhook:", webhookError);
        // Continue execution - we don't want to fail the user's submission if only the webhook fails
      }
      
      // Update rate limit timestamp for this username
      submissionTimestamps.set(username, currentTime);
      
      // Return success
      return res.status(201).json({ 
        message: "Application submitted successfully", 
        id: application.id 
      });
      
    } catch (error) {
      console.error("Application submission error:", error);
      return res.status(500).json({ message: "Failed to submit application" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
