// src/controllers/questionController.ts
import {Question} from '@model/question';

const createQuestion = async (req, res) => {
  console.log("you are thier to at creteQuestion");
  
  const user = req.user;
  const credit = user.credit;
  if( credit > 0 ){
    res.status(402).json({
      success: false,
      message: 'Not enough credit'
    })
  }
  // title => Select your interview type
  //bywhom => Select practice type
  //frndemail => Enter email
  const { title, bywhom, frndemail } = req.query;
  const userexitorNot = await Question.findOne({email: frndemail});

  if(!userexitorNot){
    res.status(400).json({
      success: false,
      message: 'User not found , please invite your friend'
    })
  }


  const { time }  = req.query;

  const question = new Question({
    title,
    bywhom,
    frndemail,
    time
  })

  if(!question){
    res.status(400).json({
      success: false,
      message: 'Question not found'
    })
  }

  // const addQuestion = await user.addQuestion(question);
  user.question = question;
  userexitorNot.question = question;

  await userexitorNot.save();
  await user.save();

  res.status(201).json({
    success: true,
    data: user.question,
    message: 'Question added successfully'
  })

};

const questionController = {
  // Create a new question
  async createQuestion(req, res) {
    try {
      const { title, link, tag } = req.body;

      const question = new Question({
        title,
        link,
        tag: tag.toLowerCase()
      });

      const savedQuestion = await question.save();
      
      res.status(201).json({
        success: true,
        data: savedQuestion
      });
    } catch (error ) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create question',
        ...(error.errors && { errors: error.errors })
      });
    }
  },

  // Get all questions with filtering, pagination and sorting
  async getQuestions(req, res) {
    try {
      const { tag, page = 1, limit = 10, sortBy = '-createdAt' } = req.query   ;
      
      // Build query
      const query = tag ? { tag: tag.toLowerCase() } : {};
      
      // Calculate skip value for pagination
      const skip = (Number(page) - 1) * Number(limit);

      const questions = await Question.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(Number(limit))
        .lean();

      // Get total count for pagination
      const total = await Question.countDocuments(query);

      res.status(200).json({
        success: true,
        data: questions,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total
        }
      });
    } catch (error  ) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch questions'
      });
    }
  },

  // Get a single question by ID
  async getQuestionById(req, res) {
    try {
      const { id } = req.params;

      const question = await Question.findById(id).lean();

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }

      res.status(200).json({
        success: true,
        data: question
      });
    } catch (error  ) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch question'
      });
    }
  },


  // Delete a question
  async deleteQuestion(req, res) {
    try {
      const { id } = req.params;

      const question = await Question.findByIdAndDelete(id);

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Question deleted successfully'
      });
    } catch (error  ) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete question'
      });
    }
  },

  // Get questions by tag
  async getQuestionsByTag(req, res) {
    try {
      const { tag } = req.params;
      const { page = 1, limit = 10 } = req.query   ;

      const skip = (Number(page) - 1) * Number(limit);

      const questions = await Question.find({ tag: tag.toLowerCase() })
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean();

      const total = await Question.countDocuments({ tag: tag.toLowerCase() });

      res.status(200).json({
        success: true,
        data: questions,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total
        }
      });
    } catch (error  ) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch questions'
      });
    }
  },

  // Search questions by title
  async searchQuestions(req, res) {
    try {
      const { query } = req.query;
      const { page = 1, limit = 10 } = req.query ;

      const skip = (Number(page) - 1) * Number(limit);

      const questions = await Question.find({
        title: { $regex: query, $options: 'i' }
      })
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean();

      const total = await Question.countDocuments({
        title: { $regex: query, $options: 'i' }
      });

      res.status(200).json({
        success: true,
        data: questions,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total
        }
      });
    } catch (error ) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search questions'
      });
    }
  }
};

module.exports = createQuestion;