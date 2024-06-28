/** 
 * Data transfer object for user Register
 */
class RegisterDto {
    /** @type {string} */
    username;
    /** @type {string} */
    fullName;
    /** @type {string} */
    password;
    /** @type {string} */
    lang;
    /** @type {string} */
    email;
     /** @type {Date} */
    birth;


    static fromBody(body) {
        const registerDto = new RegisterDto();
        registerDto.username = body.username;
        registerDto.fullName = body.fullName;
        registerDto.password = body.password;
        registerDto.lang = body.lang;
        registerDto.email = body.email;
        registerDto.birth = body.birth;

        return registerDto;
    }


}

module.exports = RegisterDto