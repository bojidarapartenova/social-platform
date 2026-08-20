import { apiSlice } from "../../app/apiSlice";

interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name?: string;
    username: string;
    email: string;
    password: string;
    avatarUrl?: string;
    bio?: string;
}

interface AuthResponse {
    token: string;
    user: { _id: string; name?: string; username: string; role: string; avatarUrl?: string; bio?: string };
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginInput>({
            query: (body) => ({ url: "/auth/login", method: "POST", body }),
        }),
        register: builder.mutation<AuthResponse, RegisterInput>({
            query: (body) => ({ url: "/auth/register", method: "POST", body }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;