# --- Rust build ---
# Use the official Rust image as the base image
FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef

# Set the working directory
WORKDIR /usr/src/projeto-integrador-transdisciplinar

# Copy the actual source code
FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder 
COPY --from=planner /usr/src/projeto-integrador-transdisciplinar/recipe.json recipe.json
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --release --recipe-path recipe.json
# Build application
COPY . .
RUN cargo build --release

# ----------

# --- Final image ---
FROM debian:bookworm-slim

# Copy the compiled binary from the builder stage
RUN apt update && apt install -y \ 
    perl-modules \
    libc6 \
    ca-certificates
COPY --from=builder /usr/src/projeto-integrador-transdisciplinar/target/release/projeto-integrador-transdisciplinar /usr/local/bin/

EXPOSE 8080

WORKDIR /usr/local/
# Set the command to run the binary
CMD ["projeto-integrador-transdisciplinar"]
