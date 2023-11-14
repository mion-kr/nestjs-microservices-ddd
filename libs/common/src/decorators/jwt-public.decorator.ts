import { SetMetadata } from '@nestjs/common';

export const publicKey = 'isPublic';
export const IsPublic = () => SetMetadata(publicKey, true);
