const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Topic = require('../model/topic');

const topicsData = [
    {
        name: "Web Development",
        slug: "web-development",
        aliases: ["web dev", "webdev", "full stack web", "web application development", "web programming"],
        parent: null,
        related: ["frontend-development", "backend-development", "javascript", "mern-stack"]
    },
    {
        name: "Frontend Development",
        slug: "frontend-development",
        aliases: ["frontend", "front end", "client side", "ui development"],
        parent: "web-development",
        related: ["react", "html-css", "javascript", "vue", "angular"]
    },
    {
        name: "Backend Development",
        slug: "backend-development",
        aliases: ["backend", "back end", "server side", "api development"],
        parent: "web-development",
        related: ["nodejs", "python", "express", "mongodb", "sql"]
    },
    {
        name: "JavaScript",
        slug: "javascript",
        aliases: ["js", "vanilla js", "es6", "ecmascript"],
        parent: "web-development",
        related: ["typescript", "react", "nodejs", "frontend-development"]
    },
    {
        name: "TypeScript",
        slug: "typescript",
        aliases: ["ts"],
        parent: "javascript",
        related: ["javascript", "react", "nodejs", "angular"]
    },
    {
        name: "HTML & CSS",
        slug: "html-css",
        aliases: ["html", "css", "html5", "css3", "web design"],
        parent: "frontend-development",
        related: ["tailwind-css", "frontend-development"]
    },
    {
        name: "React",
        slug: "react",
        aliases: ["reactjs", "react.js", "react js"],
        parent: "frontend-development",
        related: ["nextjs", "javascript", "redux", "frontend-development"]
    },
    {
        name: "Next.js",
        slug: "nextjs",
        aliases: ["next.js", "next js", "next"],
        parent: "react",
        related: ["react", "react-native", "full-stack"]
    },
    {
        name: "Vue.js",
        slug: "vue",
        aliases: ["vuejs", "vue.js", "vue js"],
        parent: "frontend-development",
        related: ["frontend-development", "javascript", "nuxt"]
    },
    {
        name: "Angular",
        slug: "angular",
        aliases: ["angularjs", "angular.js", "angular 2+"],
        parent: "frontend-development",
        related: ["typescript", "frontend-development"]
    },
    {
        name: "Tailwind CSS",
        slug: "tailwind-css",
        aliases: ["tailwind", "tailwindcss"],
        parent: "html-css",
        related: ["html-css", "frontend-development"]
    },
    {
        name: "Node.js",
        slug: "nodejs",
        aliases: ["node", "node.js", "node js"],
        parent: "backend-development",
        related: ["express", "javascript", "backend-development"]
    },
    {
        name: "Express.js",
        slug: "express",
        aliases: ["expressjs", "express.js", "express js"],
        parent: "nodejs",
        related: ["nodejs", "mern-stack", "backend-development"]
    },
    {
        name: "MERN Stack",
        slug: "mern-stack",
        aliases: ["mern", "mongodb express react node", "full stack mern"],
        parent: "web-development",
        related: ["react", "nodejs", "mongodb", "express"]
    },
    {
        name: "Python",
        slug: "python",
        aliases: ["py", "python3"],
        parent: null,
        related: ["django", "fastapi", "machine-learning", "data-science"]
    },
    {
        name: "Django",
        slug: "django",
        aliases: ["django framework"],
        parent: "python",
        related: ["python", "backend-development"]
    },
    {
        name: "FastAPI",
        slug: "fastapi",
        aliases: ["fast api"],
        parent: "python",
        related: ["python", "backend-development"]
    },
    {
        name: "Java",
        slug: "java",
        aliases: ["core java", "java se", "java programming"],
        parent: null,
        related: ["spring-boot", "dsa", "kotlin", "android-development"]
    },
    {
        name: "Spring Boot",
        slug: "spring-boot",
        aliases: ["spring", "springboot"],
        parent: "java",
        related: ["java", "backend-development"]
    },
    {
        name: "C++",
        slug: "cpp",
        aliases: ["c++", "c plus plus", "cpp"],
        parent: null,
        related: ["dsa", "c-programming", "game-development"]
    },
    {
        name: "Data Structures & Algorithms",
        slug: "dsa",
        aliases: ["data structures and algorithms", "data structures", "algorithms", "problem solving", "competitive programming"],
        parent: null,
        related: ["cpp", "java", "python", "javascript"]
    },
    {
        name: "Machine Learning",
        slug: "machine-learning",
        aliases: ["ml", "machinelearning"],
        parent: "artificial-intelligence",
        related: ["deep-learning", "data-science", "python"]
    },
    {
        name: "Artificial Intelligence",
        slug: "artificial-intelligence",
        aliases: ["ai", "artifical intelligence"],
        parent: null,
        related: ["machine-learning", "deep-learning", "generative-ai"]
    },
    {
        name: "Deep Learning",
        slug: "deep-learning",
        aliases: ["dl", "deeplearning", "neural networks"],
        parent: "artificial-intelligence",
        related: ["machine-learning", "computer-vision", "nlp"]
    },
    {
        name: "Data Science",
        slug: "data-science",
        aliases: ["datascience", "data analytics", "data analysis"],
        parent: null,
        related: ["python", "machine-learning", "sql"]
    },
    {
        name: "SQL",
        slug: "sql",
        aliases: ["database", "relational database", "mysql", "postgresql"],
        parent: null,
        related: ["mongodb", "backend-development", "data-science"]
    },
    {
        name: "MongoDB",
        slug: "mongodb",
        aliases: ["mongo", "nosql"],
        parent: null,
        related: ["mern-stack", "backend-development", "sql"]
    },
    {
        name: "Mobile Development",
        slug: "mobile-development",
        aliases: ["mobile dev", "app development"],
        parent: null,
        related: ["android-development", "ios-development", "flutter", "react-native"]
    },
    {
        name: "Android Development",
        slug: "android-development",
        aliases: ["android", "android dev", "android app development"],
        parent: "mobile-development",
        related: ["kotlin", "flutter", "java"]
    },
    {
        name: "iOS Development",
        slug: "ios-development",
        aliases: ["ios", "ios dev", "swift", "swiftui"],
        parent: "mobile-development",
        related: ["flutter", "react-native"]
    },
    {
        name: "Flutter",
        slug: "flutter",
        aliases: ["dart", "flutter dev"],
        parent: "mobile-development",
        related: ["mobile-development", "react-native", "android-development"]
    },
    {
        name: "React Native",
        slug: "react-native",
        aliases: ["reactnative", "rn"],
        parent: "mobile-development",
        related: ["react", "mobile-development", "flutter"]
    },
    {
        name: "DevOps",
        slug: "devops",
        aliases: ["dev ops", "cloud engineering", "ci cd"],
        parent: null,
        related: ["docker", "kubernetes", "aws", "linux"]
    },
    {
        name: "Docker",
        slug: "docker",
        aliases: ["containers", "containerization"],
        parent: "devops",
        related: ["kubernetes", "devops"]
    },
    {
        name: "Kubernetes",
        slug: "kubernetes",
        aliases: ["k8s"],
        parent: "devops",
        related: ["docker", "devops"]
    },
    {
        name: "Git & GitHub",
        slug: "git",
        aliases: ["git", "github", "version control"],
        parent: null,
        related: ["web-development", "devops"]
    }
];

async function seedTopics() {
    const mongoUri = process.env.dataBase_url;
    if (!mongoUri) {
        console.error("Missing dataBase_url in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB for topic seeding.");

        for (const topic of topicsData) {
            await Topic.findOneAndUpdate(
                { slug: topic.slug },
                { $set: topic },
                { upsert: true, new: true }
            );
        }

        const count = await Topic.countDocuments();
        console.log(`Successfully seeded ${topicsData.length} topics. Total in collection: ${count}`);
    } catch (error) {
        console.error("Failed to seed topics:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

seedTopics();
