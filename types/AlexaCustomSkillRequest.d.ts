export type SkillRequest = {
  type: string;
  reason: string;
  requestId: string;
  timestamp: string;
  locale: string;
  intent?: {
    name: string;
    slots: any;
  }
};

export type SkillSession ={
  new: boolean;
  sessionId: string;
  application: {
    applicationId: string
  };
  attributes: any;
  user: {
    userId: string;
    accessToken: string
  }
};

export type AlexaCustomSkillRequest = {
  version: string;
  session: SkillSession;
  context: {
    System: {
      application: {
        applicationId: string
      };
      user: {
        userId: string;
        accessToken: string
      };
      device: {
        supportedInterfaces: {
          AudioPlayer: {}
        }
      }
    };
    AudioPlayer: {
      token: string;
      offsetInMilliseconds: number;
      playerActivity: string
    }
  };
  request: SkillRequest
};
