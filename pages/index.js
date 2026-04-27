import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setPosts(data)
    }
  }

  const addPost = async () => {
    if (!content.trim()) return

    // 简单防引流
    if (content.includes('微信') || content.includes('wx')) {
      alert('不可以引流哦～')
      return
    }

    await supabase.from('posts').insert([
      {
        content,
        anonymous_id: '小月亮#' + Math.floor(Math.random() * 10000)
      }
    ])

    setContent('')
    fetchPosts()
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h2>🌙 树洞</h2>
      <p style={{ color: '#666' }}>
        这里没有人认识你，但有人愿意听你说话。
      </p>

      <textarea
        placeholder="说点没人知道的话..."
        value={content}
        onChange={e => setContent(e.target.value)}
        style={{ width: '100%', height: 100, marginTop: 10 }}
      />

      <button onClick={addPost} style={{ marginTop: 10 }}>
        投递
      </button>

      <hr style={{ margin: '20px 0' }} />

      {posts.map(p => (
        <div key={p.id} style={{ marginBottom: 20 }}>
          <p>{p.content}</p>
          <small style={{ color: '#999' }}>{p.anonymous_id}</small>
        </div>
      ))}
    </div>
  )
}
