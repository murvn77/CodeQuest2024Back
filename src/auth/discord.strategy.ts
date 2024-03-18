import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { AuthService } from './services/auth.service';
import { HttpService } from '@nestjs/axios';

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
          scope: 'identify',
        },
      )}`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      scope: 'identify',
      clientID,
      clientSecret,
      callbackURL,
    });
  }

  async validate(accessToken: string): Promise<any> {
    console.log(accessToken);
    const { data } = await this.http
      .get('https://discordapp.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();
    console.log(data);
    return this.authService.findUserFromDiscordId(data.id);
  }
}
