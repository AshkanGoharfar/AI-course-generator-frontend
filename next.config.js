/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        RAG_API_URL: process.env.RAG_API_URL,
        GPT4_API_URL: process.env.GPT4_API_URL,
        OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY
    }
}

module.exports = nextConfig
