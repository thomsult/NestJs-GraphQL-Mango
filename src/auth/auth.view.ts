import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthView {
  SignUpView() {
    return `<form action="/auth/signup" method="POST">
        <div>
        <a href="/auth/google">Sign Up with Google</a>
        <p>or</p>
          <label for="email">Email</label>
          <input type="email" name="email" id="email" />
          </div>
          <div>
          <label for="password">Password</label>
          <input type="password" name="password" id="password" />
          </div>
          <div>
          <label for="passwordConfirmation">Password Confirmation</label>
          <input type="password" name="passwordConfirmation" id="passwordConfirmation" />
          </div>
          <button>Sign Up</button>
          <a href="/auth/login">Log In</a>
          
          
          </form>
          `;
  }
  LoginView() {
    return `<form action="/auth/login" method="POST">
        <div>
        <a href="/auth/google">Login with Google</a>
        <p>or</p>
          <label for="email">Email</label>
          <input type="email" name="username" id="email" />
          </div>
          <div>
          <label for="password">Password</label>
          <input type="password" name="password" id="password" />
          </div>
          <button>Log In</button>
          </form>
          `;
  }
}
