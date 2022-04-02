import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class LoginBodyDto extends User {}

export class LogintOutput extends CoreOutput {}
