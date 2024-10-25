import User from '../models/user.js';

/**
 * Controller to create a new question for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createQuestion = async (req, res) => {
  try {
    // 1. Get the authenticated user
    // const user = req.user;
    // if (!user) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Authentication required'
    //   });
    // }
    const loginUserEmail = "david.miller@example.com"  //change this according to user
    const user = await User.findOne({ email: loginUserEmail });
    // 2. Validate credit
    if (user.credit.total <= user.credit.used) {
      return res.status(402).json({
        success: false,
        message: 'Not enough credits'
      });
    }

    // 3. Validate required fields
    const { title, link, tag, friendEmail,time } = req.body; // Changed from req.query to req.body for POST requests

    if (!title || !link || !tag || !friendEmail || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, link, tag, and friendEmail are required'
      });
    }

    
    // 4. Validate tag is one of the allowed values
    const validTags = ['beginner', 'intermediate', 'advanced'];
    if (!validTags.includes(tag.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tag. Must be one of: beginner, intermediate, advanced'
      });
    }

    //4.5 Valide time
    if(time === user.start_time){
      return res.status(400).json({
        success: false,
        message: 'You are already scheduled at this time.'
      });
    }



    // 5. Find friend user
    const friendUser = await User.findByEmail(friendEmail);
    if (!friendUser) {
      return res.status(404).json({
        success: false,
        message: 'Friend user not found. Please invite them to join first.'
      });
    }

    if(time === friendUser.start_time){
      return res.status(400).json({
        success: false,
        message: 'Your friend is already scheduled at this time.'
      });
    }

    // 6. Create new question object
    const newQuestion = {
      title,
      link,
      tag: tag.toLowerCase()
    };

    // 7. Add question to both users
    user.questions.push(newQuestion);
    friendUser.questions.push(newQuestion);

    // 8. Increment used credits
    user.credit.used += 1;

    // 9. Save both users
    await Promise.all([
      user.save(),
      friendUser.save()
    ]);

    // 10. Send success response
    return res.status(201).json({
      success: true,
      data: {
        question: newQuestion,
        remainingCredits: user.credit.total - user.credit.used
      },
      message: 'Question created successfully'
    });

  } catch (error) {
    console.error('Error in createQuestion:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all questions for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserQuestions = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    return res.status(200).json({
      success: true,
      data: user.questions,
      remainingCredits: user.credit.total - user.credit.used
    });

  } catch (error) {
    console.error('Error in getUserQuestions:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export { createQuestion, getUserQuestions };