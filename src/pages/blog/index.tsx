// pages/index.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>欢迎访问我的博客</h1>
      <Link href="/blog">
        查看所有文章
      </Link>
    </div>
  )
}