# This is a minimal `default.nix` by yarn-plugin-nixify. You can customize it
# as needed, it will not be overwritten by the plugin.

{ pkgs ? import <nixpkgs> { } }:

let
  project =
    pkgs.callPackage ./yarn-project.nix
      {
        nodejs = pkgs.nodejs-slim_20;
      }
      {
        src = ./.;
      };
in
project.overrideAttrs (oldAttrs: {

  name = "avalon";

  buildPhase = ''
    (cd client && yarn build)
  '';

})
