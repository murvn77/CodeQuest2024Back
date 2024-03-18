import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { AuthService } from './services/auth.service';
import { HttpService } from '@nestjs/axios';
import { Administrator } from 'src/user/entities/administrator.entity';

// change these to be your Discord client ID and secret
const clientID = '1218718388809891841'; //953826763094499328
const clientSecret = 'NmMU9hIzlnC18bs3qToZDFAlxg6H1BF8'; //axC7kdZN4kx3toAz491C2LVipGd_n17S
const callbackURL = 'http://localhost:5173/principal'; //'https://codequest2024front.onrender.com/principal';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private authService: AuthService,
    private http: HttpService,
  ) {
    super({
      authorizationURL: `https://discordapp.com/api/oauth2/authorize?${stringify(
        {
          client_id: clientID,
          redirect_uri: callbackURL,
          response_type: 'code',
          scope: 'identify+guilds+guilds.members.read',
        },
      )}`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      scope: 'identify+guilds+guilds.members.read',
      clientID,
      clientSecret,
      callbackURL,
    });
  }

  async validate(accessToken: string): Promise<any> {
    const dataAdminDB = new Administrator();
    const serverId = '1216945509244207154'; //1130903938099593427
    const roleAdminId='1219041365959249932';
    console.log(accessToken);
    const { data } = await this.http
      .get(`https://discord.com/api/users/@me/guilds/${serverId}/member`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();
    console.log(data);
    if (data.roles.find((element) => element == roleAdminId)) {
      console.log('Is admin');
      // const { data } = await this.http
      //   .get('https://discordapp.com/api/users/@me', {
      //     headers: { Authorization: `Bearer ${accessToken}` },
      //   })
      //   .toPromise();
      // console.log(data);
      const adminDB = await this.authService.findUserFromDiscordId(
        data.user.id,
      );
      if (!adminDB) {
        console.log(`Isn't in DB`);

        dataAdminDB.discord_id = data.user.id;
        dataAdminDB.name = data.user.username;
        dataAdminDB.email = data.user.email;
        dataAdminDB.avatar = data.user.avatar;
        console.log(dataAdminDB);

        await this.authService.createAdministratorInDB(dataAdminDB);
      } else {
        console.log('Is in DB');

        dataAdminDB.discord_id = adminDB.user.id;
        dataAdminDB.name = adminDB.user.username;
        dataAdminDB.email = adminDB.user.email;
        dataAdminDB.avatar = adminDB.user.avatar;
        console.log(dataAdminDB);
      }
    } else {
      console.log(`Isn't Admin`);
      throw new UnauthorizedException();
    }

    return dataAdminDB;
  }
}
