const { Thought, reactionSchema } = require("../models");
module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  //   find a single thought by its ID
  async getSingleThought(req, res) {
    try {
      const thoughts = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!thoughts) {
        res.status(404).json({ message: "no thoughts found with that id" });
      }
      res.json({ thoughts });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  //   create a new thought
  async createThought(req, res) {
    try {
      const thoughts = await Thought.create(req.body);
      res.json(thoughts);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //   delete a thought by its ID
  async deleteThought(req, res) {
    try {
      const thoughts = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });
      if (!thoughts) {
        res.status(404).json({ message: "no thoughts found with that id" });
      }
      res.json(thoughts);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //   update a thought by its ID
  async updateThought(req, res) {
    try {
      const thoughts = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thoughts) {
        res.status(404).json({ message: "no thoughts found with that id" });
      }
      res.json(thoughts);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //   create a reaction for a thought
  async createReaction(req, res) {
    try {
      const reaction = await reactionSchema.create(req.body);
      const thoughts = await Thought.findByOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: reaction._id } },
        { runValidators: true, new: true }
      );
      if (!thoughts) {
        res.status(404).json({ message: "no thoughts found with that id" });
      }
      res.json(reaction);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //   delete a reaction by its ID
  async deleteReaction(req, res) {
    try {
      const reaction = await reactionSchema.findOneAndRemove({
        _id: req.params.reactionSchemaId,
      });
      const thoughts = await Thought.findByOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: req.params.reactionSchemaId } },
        { runValidators: true, new: true }
      );
      if (!reaction) {
        res.status(404).json({ message: "no reactions found with that id" });
      }
      if (!thoughts) {
        res.status(404).json({ message: "no thoughts found with that id" });
      }
      res.json(reaction);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
