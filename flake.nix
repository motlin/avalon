{
  description = "Avalon game server Flake";

  inputs = {

    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/x86_64-linux";
    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs.systems.follows = "systems";
    };

  };

  outputs = { self, nixpkgs, flake-utils, ... }@inputs:
    let
      overlay = final: prev: {
        avalon-online = final.callPackage ./default.nix { };
      };
      rev = if (self ? shortRev) then self.shortRev else self.dirtyShortRev;
    in
    flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = import nixpkgs { inherit system; overlays = [ overlay ]; }; in
        {
          packages = rec {
            default = pkgs.avalon-online;
            container = pkgs.dockerTools.buildImage {
              name = "avalon";
              tag = "${rev}";
              config = {
                Cmd = [ "${pkgs.avalon-online}/bin/avalon-server" ];
                ExposePorts = { "8001/tcp" = { }; };

              };
            };
          };
        }
      )
    // {
      overlays.default = overlay;
    }
  ;
}
