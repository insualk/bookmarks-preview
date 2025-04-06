import { Card, CardContent } from "@/components/ui/Card";

const PreviewCard = ({ preview }) => {
  // console.log(preview)
  return (
    <div className="p-2">
    <Card >
      <CardContent>
        <div className="flex flex-col">
          <img src={preview.screenshot} alt="Preview" className="w-full h-32 object-cover mb-2" />
          {/* <h2 className="text-lg font-semibold">{preview.title}</h2> */}
          {/* <p className="text-sm text-gray-600">{preview.description}</p> */}
          <a href={preview.url} className="text-blue-500 mt-2 block">
            {preview.url}
          </a>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

export default PreviewCard