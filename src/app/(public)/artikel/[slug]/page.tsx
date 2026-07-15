import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Calendar, BookOpen } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = supabaseAdmin;

  const { data: article } = await supabase
    .from('articles')
    .select(`
      *,
      author:users(name),
      media:media_assets!media_asset_id(id, url)
    `)
    .eq('slug', slug)
    .single();

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link href="/artikel" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Artikel
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author?.name || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Draft'}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 bg-slate-100 flex items-center justify-center">
          {article.media ? (
            <img src={article.media.url} alt={article.title} className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="w-16 h-16 text-slate-300" />
          )}
        </div>

        {/* Content */}
        {/* We use basic whitespace preservation since it might just be text from textarea */}
        <article className="prose prose-lg prose-slate max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-500 whitespace-pre-wrap">
          {article.content}
        </article>

        {/* Footer / Share CTA */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <p className="text-sm text-slate-500 text-center">
            Bagikan artikel ini untuk menyebarkan informasi bermanfaat.
          </p>
        </div>
      </div>
    </div>
  );
}
