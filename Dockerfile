FROM ubuntu:22.04
WORKDIR /
RUN apt-get update && apt-get install -y fftw3 libfftw3-dev ffmpeg cmake git build-essential libavcodec-dev libavformat-dev libavfilter-dev
RUN git clone https://github.com/sportdeath/audiorw
RUN mkdir audiorw/build
WORKDIR /audiorw/build
RUN cmake ..
RUN make
RUN make install
WORKDIR /
RUN git clone https://github.com/sportdeath/audio_transport
RUN mkdir audio_transport/build
WORKDIR /audio_transport/build
RUN cmake .. -D BUILD_EXAMPLES=ON
RUN make install
