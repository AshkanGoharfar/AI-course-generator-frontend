import Image from "next/image";
import styles from "./page.module.css";
import FileUpload from "@/components/FileUpload";

export default function Home() {
  return (
    <main className={styles.main}>
      <FileUpload />
    </main>
  );
}
