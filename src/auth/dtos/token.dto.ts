import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from 'src/users/entities/user.entity';

export class RefreshTokenDto extends PickType(User, ['refresh_token']) {}

export class RefreshTokenOutput extends CoreOutput {
  access_token?: string;

  refresh_token?: string;
}
