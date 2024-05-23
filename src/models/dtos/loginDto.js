/** 
 * Data transfer object for user login
 */
class LoginDto {
    /** @type {string} */
    username;
    /** @type {string} */
    password;
    /** @type {string} */
    email;


    static fromBody(body) {
        const loginDto = new LoginDto();
        loginDto.username = body.username;
        loginDto.password = body.password;
        loginDto.email = body.email;
        return loginDto;
    }

    toJson() {  
        return {
            username: this.username,
            password: this.password,
            email: this.email
        };
    }
}

module.exports = LoginDto