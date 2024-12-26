
{ pkgs }: {
  deps = [
    pkgs.nodePackages.parcel
    pkgs.killall
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.pkg-config
    pkgs.cairo
    pkgs.pixman
    pkgs.libsodium
  ];
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.cairo
      pkgs.pixman
      pkgs.libsodium
    ];
  };
}
