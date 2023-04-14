import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthView {
  SignUpView() {
    return `<form action="/auth/signup" method="POST">
        <div>
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
          </form>
          `;
  }
  LoginView() {
    return `<form action="/auth/login" method="POST">
        <div>
          <label for="email">Email</label>
          <input type="email" name="email" id="email" />
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
