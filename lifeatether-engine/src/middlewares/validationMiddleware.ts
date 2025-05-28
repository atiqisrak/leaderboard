import { Request, Response, NextFunction } from 'express';

export const validateReactionType = (req: Request, res: Response, next: NextFunction) => {
  const validTypes = ['like', 'love', 'haha', 'wow', 'angry'];
  const { reaction_type } = req.body;

  if (!reaction_type) {
    return res.status(400).json({
      success: false,
      message: 'Reaction type is required'
    });
  }

  if (!validTypes.includes(reaction_type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid reaction type. Must be one of: like, love, haha, wow, angry'
    });
  }

  next();
}; 