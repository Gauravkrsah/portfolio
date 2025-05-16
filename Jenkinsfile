pipeline {
    agent any

    environment {
        // Define environment variables
        DOCKER_REGISTRY = credentials('docker-registry-url')
        DOCKER_CREDS = credentials('docker-credentials-id')
        // These credentials will need to be set up in Jenkins
        GITHUB_TOKEN = credentials('github-token')
        GEMINI_API_KEY = credentials('gemini-api-key')
        SUPABASE_URL = credentials('supabase-url')
        SUPABASE_ANON_KEY = credentials('supabase-anon-key')
        SUPABASE_SERVICE_ROLE_KEY = credentials('supabase-service-role-key')
    }

    stages {
        stage('Checkout') {
            steps {
                // Check out from version control with credentials
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Gauravkrsah/portfolio.git',
                        credentialsId: 'github-token'
                    ]]
                ])
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('backend-api') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend-api') {
                            sh 'npm test'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend-api') {
                            sh 'npm run build'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    // Log in to Docker registry
                    sh 'echo $DOCKER_CREDS_PSW | docker login $DOCKER_REGISTRY -u $DOCKER_CREDS_USR --password-stdin'
                    
                    // Build and push backend
                    sh 'docker build -t $DOCKER_REGISTRY/portfolio-backend:$BUILD_NUMBER -t $DOCKER_REGISTRY/portfolio-backend:latest ./backend-api'
                    sh 'docker push $DOCKER_REGISTRY/portfolio-backend:$BUILD_NUMBER'
                    sh 'docker push $DOCKER_REGISTRY/portfolio-backend:latest'
                    
                    // Build and push frontend
                    sh 'docker build -t $DOCKER_REGISTRY/portfolio-frontend:$BUILD_NUMBER -t $DOCKER_REGISTRY/portfolio-frontend:latest ./frontend'
                    sh 'docker push $DOCKER_REGISTRY/portfolio-frontend:$BUILD_NUMBER'
                    sh 'docker push $DOCKER_REGISTRY/portfolio-frontend:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Deploy using Docker Compose
                    sh 'docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d'
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            echo 'Deployment successful!'
            // You could add notification steps here
        }
        failure {
            echo 'Deployment failed!'
            // You could add notification steps here
        }
    }
}
