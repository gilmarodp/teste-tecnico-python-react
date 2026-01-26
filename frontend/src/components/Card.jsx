function Card(props) {
  return (
    <div
      className="border-b rounded-md flex flex-col p-2 m-2 bg-pink-500"
      {...props}
    >
      <p className="font-bold text-lg ">
        {props.item.title}
      </p>
    </div>
  );
}

export default Card;