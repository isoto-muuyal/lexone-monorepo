@extends('admin.layouts.sidebar')
@section('title', 'Category Detail')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">{{__('messages.Category')}} {{__('messages.Detail')}}</h4>
            </div>
        </div>
        @if($categorydetail->description)
          <h5>{{__('messages.How It Works')}}</h5>
          <div>
          {{htmlspecialchars_decode($categorydetail->description)}} 
          </div>
        @endif
        @if($categorydetail->faq)
          <h5>{{__('messages.FAQ')}}</h5>
          <div>
            <p class="p-4">{{strip_tags(html_entity_decode($categorydetail->faq))}}</p>
          </div>
        @endif
        @if($categorydetail->about)
          <h5>{{__('messages.About')}}</h5>
          <div>
            <p class="p-4">{{strip_tags(html_entity_decode($categorydetail->about))}}</p>
          </div>
        @endif
    </div>
@endsection