import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsString } from 'class-validator';

@Injectable()
@Entity()
export class User extends CoreEntity {
  // https://typeorm.delightful.studio/interfaces/_decorator_options_columnoptions_.columnoptions.html
  @Column()
  @IsString()
  name: string;

  @Column({ select: false })
  @IsString()
  password: string;

  @Column({ nullable: true })
  @IsString()
  refresh_token?: string;

  @BeforeInsert() // Entity Listener
  @BeforeUpdate() // password need to hashed before save.
  async hashPassword(): Promise<void> {
    if (this.password) {
      // 2. hash the password if there is a pw in the object that give to save
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(plainPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
