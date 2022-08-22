import * as jwt from 'jsonwebtoken';

import * as jwtd from 'jwt-decode';


export function sign(payload: object) {
    const jwtSecret = 'secret_key_goes_here';
    const jwtOptions = {
        algorithm: 'none' as jwt.Algorithm,
        expiresIn: '300s',
    };
    
    return jwt.sign(payload, jwtSecret, jwtOptions);
}

export function decode<O extends object>(token: string): O {
    return jwtd.default(token)
}

//TODO: フロントエンドでは...payload入れるところ -> jwtに変換 -> headerに付与 -> lambda@edgeに送りつけ -> edgeでpayload検証

exports.handler = (event: any, context: any, callback: any) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    if (headers.authorization &&
        headers.authorization.split(' ')[0] === 'Bearer') {
        const token = headers.authorization.split(' ')[1];
        const payload = decode<{"secret": string}>(token)
        if (payload.secret === "HIMITSU") {
            callback(null, request);
            return
        } else {
            const response = {
                status: '401',
            };
            callback(null, response);
            return   
        }
    } else {
        const response = {
            status: '401',
        };
        callback(null, response);
        return
    }

};
