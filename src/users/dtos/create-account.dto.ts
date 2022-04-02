import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class CreateAccountBodyDto extends User {}

export class CreateAccountOutput extends CoreOutput {}
