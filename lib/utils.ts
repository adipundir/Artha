import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mockHolders = [
  {
    id: 1,
    address: "0x5d54d430D1FD9425976147318E6080479bffC16D",
    shortAddress: "0x5d54...C16D",
    mntBalance: 8624576,
    usdValue: 5102690,
    lastActivity: "Recently",
    is_contract: true,
    name: "Liquidity Book Token"
  },
  {
    id: 2,
    address: "0xeAfc4D6d4c3391Cd4Fc10c85D2f5f972d58C0dD5",
    shortAddress: "0xeAfc...0dD5",
    mntBalance: 4404851,
    usdValue: 2606080,
    lastActivity: "Recently",
    is_contract: true,
    name: "AgniPool"
  },
  {
    id: 3,
    address: "0x683696523512636B46A826A7e3D1B0658E8e2e1c",
    shortAddress: "0x6836...2e1c",
    mntBalance: 2445617,
    usdValue: 1447024,
    lastActivity: "Recently",
    is_contract: true,
    name: "Lendle Mantle Market WMNT"
  },
  {
    id: 4,
    address: "0x44949636f778fAD2b139E665aee11a2dc84A2976",
    shortAddress: "0x4494...2976",
    mntBalance: 1134991,
    usdValue: 671573,
    lastActivity: "Recently",
    is_contract: true,
    name: "INIT Wrapped Mantle"
  },
  {
    id: 5,
    address: "0x524db930F0886CdE7B5FFFc920Aae85e98C2abfb",
    shortAddress: "0x524d...abfb",
    mntBalance: 622429,
    usdValue: 368277,
    lastActivity: "Recently",
    is_contract: true,
    name: "Contract"
  },
  {
    id: 6,
    address: "0x15Bb5D31048381c84a157526cEF9513531b8BE1e",
    shortAddress: "0x15Bb...BE1e",
    mntBalance: 610297,
    usdValue: 361088,
    lastActivity: "Recently",
    is_contract: false,
    name: null
  },
  {
    id: 7,
    address: "0x763868612858358f62b05691dB82Ad35a9b3E110",
    shortAddress: "0x7638...E110",
    mntBalance: 569070,
    usdValue: 336695,
    lastActivity: "Recently",
    is_contract: true,
    name: "Moe LP Token"
  },
  {
    id: 8,
    address: "0x762B916297235dc920a8c684419e41Ab0099A242",
    shortAddress: "0x762B...9A242",
    mntBalance: 172648,
    usdValue: 102146,
    lastActivity: "Recently",
    is_contract: true,
    name: "Volatile Pair - WMNT/CLEO"
  },
  {
    id: 9,
    address: "0x1606C79bE3EBD70D8d40bAc6287e23005CfBefA2",
    shortAddress: "0x1606...BefA2",
    mntBalance: 167449,
    usdValue: 99077,
    lastActivity: "Recently",
    is_contract: true,
    name: "Liquidity Book Token"
  },
  {
    id: 10,
    address: "0x6Cc1560EFe633E8799226c87c45981ef93cFa617",
    shortAddress: "0x6Cc1...Fa617",
    mntBalance: 166080,
    usdValue: 98263,
    lastActivity: "Recently",
    is_contract: true,
    name: "Minterest Wrapped MNT"
  }
];
