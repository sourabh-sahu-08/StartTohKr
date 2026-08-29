import { 
  Innovation, 
  InnovationPost, 
  InnovationSignal, 
  InnovationTracker, 
  InnovationOpportunity, 
  InnovationComment,
  User,
  PostType,
  SignalType,
  OpportunityType,
  CommentCategory,
  InnovationStage,
  OpportunityStatus
} from '@prisma/client';

export type UserProfile = Pick<User, 'id' | 'name' | 'image' | 'role'>;

// Complete view of an Innovation including its startup
export type InnovationWithDetails = Innovation & {
  startup: UserProfile;
};

// Complete view of a post including author and innovation
export type InnovationPostWithDetails = InnovationPost & {
  author: UserProfile;
  innovation?: InnovationWithDetails | null;
  signals: InnovationSignal[];
  comments: InnovationCommentWithDetails[];
};

export type InnovationCommentWithDetails = InnovationComment & {
  user: UserProfile;
};

export interface IInnovationRepository {
  getInnovations(): Promise<InnovationWithDetails[]>;
  getInnovationById(id: string): Promise<InnovationWithDetails | null>;
  getPosts(): Promise<InnovationPostWithDetails[]>;
  createPost(data: Omit<InnovationPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<InnovationPostWithDetails>;
  toggleSignal(userId: string, type: SignalType, postId?: string, innovationId?: string): Promise<{ success: boolean; action: 'added' | 'removed' }>;
  toggleTrack(userId: string, innovationId: string): Promise<{ success: boolean; action: 'tracked' | 'untracked' }>;
  createOpportunity(data: Omit<InnovationOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<InnovationOpportunity>;
  createComment(data: Omit<InnovationComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<InnovationCommentWithDetails>;
}
