{
  description = "SkyShare Backend - FastAPI + SQLite + Gemini";

  inputs = {
    nixos-config.url = "git+file:///home/jl-nixos/nixos-config";
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.follows = "nixos-config/nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        pythonPackages = pkgs.python311Packages;
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.python311
            pkgs.google-cloud-sdk
            pythonPackages.fastapi
            pythonPackages.uvicorn
            #pythonPackages.google-cloud-aiplatform
            pythonPackages.requests
            pythonPackages.pydantic
            pythonPackages.streamlit
            pythonPackages.pandas
          ];

          shellHook = ''
            echo "🛫 SkyShare Dev Environment Loaded"
            echo "Python: $(python --version)"
            # Initialize database if it doesn't exist
            if [ ! -f "skyshare.db" ]; then
              python -c "from database import init_db; init_db()"
              echo "✅ SQLite Database Initialized"
            fi
          '';
        };
      });
}