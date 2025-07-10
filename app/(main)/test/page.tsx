// Example usage on a lecture page
import SecureVideoPlayer from '@/components/VideoPlayer';

export default function LecturePage({ params }: { params: { lectureId: string }}) {
  return (
    <div>
      <h1>Lecture Title</h1>
      <SecureVideoPlayer 
    //   lectureId={params.lectureId} 
      lectureId={"https://player.cloudinary.com/embed/?cloud_name=gurukularihant&public_id=ddy3u9sselgvdpf6w2dz&profile=cld-default"} 
      />
      <p>Lecture description goes here...</p>
    </div>
  );
}