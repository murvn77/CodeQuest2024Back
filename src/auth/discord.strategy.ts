import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { AuthService } from './services/auth.service';
import { HttpService } from '@nestjs/axios';
import { Administrator } from 'src/user/entities/administrator.entity';
// import config from 'src/config/config';
// import { ConfigType } from '@nestjs/config';

// change these to be your Discord client ID and secret
const clientID = '1216925942572650566';
const clientSecret = '5dFxgp_o2OzQJrnM2XLQgUzSVPDWk20e';
const callbackURL = 'https://codequest2024front.onrender.com/principal';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private discordConfig;
  constructor(
    // @Inject(config.KEY) private configService: ConfigType<typeof config>,
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
    // this.discordConfig = configService.discord;
  }

  async validate(accessToken: string): Promise<any> {
    try {
      console.log(this.discordConfig);
      const dataAdminDB = new Administrator();
      const serverId = '1216945509244207154';
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

          dataAdminDB.id = adminDB.id;
          dataAdminDB.username = adminDB.username;
          dataAdminDB.avatar = adminDB.avatar;
          dataAdminDB.id_administrator = adminDB.id_administrator;
          console.log(dataAdminDB);
        }
      } else {
        console.log(`Isn't Admin`);
        return data.user;
        // throw new UnauthorizedException();
      }
      return dataAdminDB;
    } catch (error) {}
  }
}
