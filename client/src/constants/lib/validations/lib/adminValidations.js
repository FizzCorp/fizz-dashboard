// exports
module.exports = {
  config: {
    adminId: {
      optional: false,
      rules: [
        {
          type: 'minLength[6]',
          prompt: 'ID must be atleast 6 characters long'
        }
      ]
    },
    adminNick: {
      optional: false,
      rules: [
        {
          type: 'minLength[6]',
          prompt: 'Nick must be atleast 6 characters long'
        }
      ]
    }
  },
  messaging: {
    channelId: {
      optional: false,
      rules: [
        {
          type: 'minLength[6]',
          prompt: 'ID must be atleast 6 characters long'
        }
      ]
    },
    channelMessage: {
      optional: false,
      rules: [
        {
          type: 'maxLength[350]',
          prompt: 'Message must be at max 350 characters long'
        }
      ]
    }
  },
  moderation: {
    userId: {
      optional: false,
      rules: [
        {
          type: 'empty',
          prompt: 'ID must have a value'
        }
      ]
    },
    channelId: {
      optional: false,
      rules: [
        {
          type: 'minLength[6]',
          prompt: 'ID must be atleast 6 characters long'
        }
      ]
    }
  }
};