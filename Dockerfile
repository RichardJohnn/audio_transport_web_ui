# ---- Stage 1: Build C++ libraries and transport binary ----
FROM ubuntu:22.04 as cpp-build

WORKDIR /

# Install build dependencies
RUN apt-get update && apt-get install -y \
    fftw3 libfftw3-dev ffmpeg cmake git build-essential \
    libavcodec-dev libavformat-dev libavfilter-dev

# Build audiorw
RUN git clone https://github.com/sportdeath/audiorw
RUN mkdir audiorw/build
WORKDIR /audiorw/build
RUN cmake ..
RUN make -j$(nproc)
RUN make install

# Build audio_transport
WORKDIR /
RUN git clone https://github.com/sportdeath/audio_transport
RUN mkdir audio_transport/build
WORKDIR /audio_transport/build
RUN cmake .. -D BUILD_EXAMPLES=ON
RUN make -j$(nproc)
RUN make install

# Copy the example binary (transport) explicitly if it exists
RUN if [ -f ./transport ]; then cp ./transport /usr/local/bin/; fi
RUN if [ -f ./examples/transport ]; then cp ./examples/transport /usr/local/bin/; fi

# ---- Stage 2: Build frontend ----
FROM node:18 as frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---- Stage 3: Final image (C++ + Node + backend + frontend) ----
FROM ubuntu:22.04

# Install runtime dependencies for transport binary and Node
RUN apt-get update && apt-get install -y \
    fftw3 libfftw3-dev \
    ffmpeg libavcodec58 libavformat58 libavfilter7 \
    libswresample3 libswscale5 curl git build-essential \
    nodejs npm

# Set working directory
WORKDIR /app

# Copy C++ libraries and transport binary from cpp-build
COPY --from=cpp-build /usr/local /usr/local
ENV PATH="/usr/local/bin:${PATH}"

RUN echo "/usr/local/lib" > /etc/ld.so.conf.d/local.conf && ldconfig

# Set up backend
WORKDIR /app/backend
COPY package*.json ./
RUN npm install

# Copy backend source
COPY backend/ ./ 

# Copy frontend build into backend/public
COPY --from=frontend-build /app/frontend/build ./public

# Create uploads folder
RUN mkdir -p routes/uploads

# Expose backend port
EXPOSE 9000

# Start backend
CMD ["node", "bin/www"]
