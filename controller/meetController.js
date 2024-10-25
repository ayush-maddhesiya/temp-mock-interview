import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CREDENTIALS_PATH = 'path/to/your/credentials.json'; // Download from Google Cloud Console

async function createGoogleMeet() {
  try {
    // 1. Authenticate with Google
    const auth = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    // 2. Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth });

    // 3. Create event with Google Meet
    const event = {
      summary: 'Coding Discussion',
      description: 'Discussion about the coding problem',
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      resource: event,
    });

    return {
      meetLink: response.data.hangoutLink,
      eventId: response.data.id,
    };
  } catch (error) {
    console.error('Error creating Google Meet:', error);
    throw error;
  }
}

// Express route handler
const createMeeting = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create Google Meet
    const meetingDetails = await createGoogleMeet();

    // Update question with meet link
    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      { 
        meetLink: meetingDetails.meetLink,
        meetStatus: 'scheduled'
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        meetLink: meetingDetails.meetLink,
        question
      }
    });

  } catch (error) {
    console.error('Error in createMeeting:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create meeting',
      error: error.message
    });
  }
};

export { createMeeting, createGoogleMeet };