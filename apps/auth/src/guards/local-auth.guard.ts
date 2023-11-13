import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuards extends AuthGuard('local') {}
