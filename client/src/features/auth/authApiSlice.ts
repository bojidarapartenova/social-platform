import { apiSlice } from "../../app/apiSlice";

interface LoginInput {
    email: string;
    password: string;
}

interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: { _id: string; username: string; role: string };
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginInput>({
            query: (body) => ({ url: "/auth/login", method: "POST", body }),
        }),
        register: builder.mutation<{ message: string }, RegisterInput>({
            query: (body) => ({ url: "/auth/register", method: "POST", body }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;