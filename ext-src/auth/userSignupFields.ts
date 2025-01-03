import { type GetUserSignupFieldsFn } from "wasp/auth/types";

export const getEmailUserFields: GetUserSignupFieldsFn = () => ({
  username: {
    type: "text",
    label: "Username",
    placeholder: "Enter your username",
  }
});

export const getGoogleUserFields: GetUserSignupFieldsFn = () => ({
  username: {
    type: "text",
    label: "Username",
    placeholder: "Enter your username",
  }
});

export const getGitHubUserFields: GetUserSignupFieldsFn = () => ({
  username: {
    type: "text",
    label: "Username",
    placeholder: "Enter your username",
  }
});

export const getDiscordUserFields: GetUserSignupFieldsFn = () => ({
  username: {
    type: "text",
    label: "Username",
    placeholder: "Enter your username",
  }
});
