//! Bams-engine Server Binary

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let server = mcp_bams_engine_core::build_bams_engine_server()?;
    server_common::run_http(server, "bams-engine", "1.0.0").await
}
