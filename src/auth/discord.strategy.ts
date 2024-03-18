import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { AuthService } from './services/auth.service';
import { HttpService } from '@nestjs/axios';
import { Administrator } from 'src/user/entities/administrator.entity';

// change these to be your Discord client ID and secret
const clientID = '1218718388809891841';
const clientSecret = 'NmMU9hIzlnC18bs3qToZDFAlxg6H1BF8';
const callbackURL = 'https://codequest2024front.onrender.com/principal';
//callbackTestChristian: http://localhost:5173/principal

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
    try {
      const dataAdminDB = new Administrator();
      //Christian: 1216945509244207154
      const serverId = '1216945509244207154';
      //Christian:1219041365959249932
      const roleAdminId = '1219041365959249932';
      console.log('AccessToken', accessToken);
      const { data } = await this.http
        .get(`https://discord.com/api/users/@me/guilds/${serverId}/member`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .toPromise();
      console.log(data);
      if (data.code === 404) {
        throw new NotFoundException(
          `El usuario no se encuentra registrado en el servidor de Discord con ID ${serverId}`,
        );
      }
      if (data.roles.find((element) => element == roleAdminId)) {
        console.log('Is admin');

        const adminDB = await this.authService.findUserFromDiscordId(
          data.user.id,
        );
        console.log('AdminDB', adminDB);
        if (adminDB == null) {
          console.log(`Isn't in DB`);
          const { data } = await this.http
            .get('https://discordapp.com/api/users/@me', {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            .toPromise();
          console.log('dataUserDiscord', data);
          dataAdminDB.id = data.id;
          dataAdminDB.username = data.username;
          dataAdminDB.avatar = data.avatar;
          console.log(dataAdminDB);

          const respondeAdmin =
            await this.authService.createAdministratorInDB(dataAdminDB);
          dataAdminDB.id_administrator = respondeAdmin.id_administrator;
        } else {
          console.log('Is in DB');

          dataAdminDB.id = adminDB.discord_id;
          dataAdminDB.username = adminDB.name;
          dataAdminDB.avatar = adminDB.avatar;
          dataAdminDB.id_administrator = adminDB.id_administrator;
          console.log(dataAdminDB);
        }
      } else {
        console.log(`Isn't Admin`);
        return data;
        // throw new UnauthorizedException();
      }
      return dataAdminDB;
    } catch (error) {}
  }
}
