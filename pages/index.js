import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [commentInputs, setCommentInputs] = useState({})

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data)
  }

  const addPost = async () => {
    if (!content.trim()) return

    await supabase.from('posts').insert([
      {
        content,
        anonymous_id: '小月亮#' + Math.floor(Math.random() * 10000)
      }
    ])

    setContent('')
    fetchPosts()
  }

  const addComment = async (postId) => {
    const text = commentInputs[postId]
    if (!text) return

    await supabase.from('comments').insert([
      {
        post_id: postId,
        content: text,
        anonymous_id: '晚风#' + Math.floor(Math.random() * 10000)
      }
    ])

    setCommentInputs({ ...commentInputs, [postId]: '' })
    fetchPosts()
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h2>🌙 树洞</h2>
      <p>这里没有人认识你，但有人愿意听你说话。</p>

      <textarea
        placeholder="说点没人知道的话..."
        value={content}
        onChange={e => setContent(e.target.value)}
        style={{ width: '100%', height: 100 }}
      />

      <button onClick={addPost}>投递</button>

      <hr />

      {posts.map(p => (
        <div key={p.id} style={{ marginBottom: 30 }}>
          <p>{p.content}</p>
          <small>{p.anonymous_id}</small>

          {/* 评论输入 */}
          <div style={{ marginTop: 10 }}>
            <input
              placeholder="抱抱TA..."
              value={commentInputs[p.id] || ''}
              onChange={e =>
                setCommentInputs({
                  ...commentInputs,
                  [p.id]: e.target.value
                })
              }
            />
            <button onClick={() => addComment(p.id)}>回复</button>
          </div>
        </div>
      ))}
    </div>
  )
}
