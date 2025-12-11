import Image from "next/image";
import { redirect } from 'next/navigation';
import { PiArrowLeft, PiDotsThree, PiCheck, PiKeyboard, PiPaperPlaneTilt, PiMicrophoneSlash, PiVideoCamera, PiCameraRotate, PiPhoneX, PiWifiHigh } from "react-icons/pi";

import Header from "./components/Header";
import BottomControls from "./components/BottomControls";

export default function Home() {
  redirect('/health/dashboard');
}
