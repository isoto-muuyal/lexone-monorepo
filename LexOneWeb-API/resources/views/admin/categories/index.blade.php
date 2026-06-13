@extends('admin.layouts.sidebar')
@section('title', 'Categories')
@section('content')
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
<div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
    <div>
    <h4 class="blueTxtClr p-t10 p-b10">
        {{trans('messages.Categories')}}
    </h4>
    </div>
    <div>
        <a href="{{ route('category.add') }}" >
            <button class="btn btn-primary align-text-top border-0 m-b10">
                <i class="fa fa-plus" title="{{trans('messages.Add')}}"></i> 
                {{trans('messages.Add')}} {{trans('messages.Category')}}
            </button>
        </a>
    </div>
</div>
<div class="">
    <form method="GET" action="{{ route('category.search') }}">
        <div class="form-group row">
            <div class="col-lg-2">
                <select id="language-selector" name="search_for" class="form-control">
                    <option value="name" <?php if($search_for === "name") { echo "selected"; } ?>>{{trans('messages.Name')}}</option>
                    <option value="type" <?php if($search_for === "type") { echo "selected"; } ?>>{{trans('messages.Type')}}</option>
                </select>
            </div>
            <div class="col-lg-6">&nbsp;</div>
            <div class="col-lg-4">
                <div class="input-group mb-3">
                    <input type="text" class="form-control search_filter" value="{{$search}}"  placeholder="{{trans('messages.Search categories')}}" name="search" autocomplete="off" maxlength="30">
                    <input type="hidden" name="sort" value="created_at">
                    <input type="hidden" name="direction" value="desc">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="submit">{{trans('messages.Search')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
<div class="table-responsive">
    <table id="example" class="table table-striped table-bordered w-100 mytable">
        <thead>
            <tr class="text-center">
                <th scope="col">{{trans('messages.S.No')}}</th>
                <th scope="col">@sortablelink('name',trans('messages.Name'))</th>
                <th scope="col">@sortablelink('type',trans('messages.Type'))</th>
                <th class="nosorting">{{trans('messages.View')}}</th>
                <th class="nosorting">{{trans('messages.Edit')}}</th>
                <th class="nosorting">{{trans('messages.Action')}}</th>
            </tr>
        </thead>
        <tbody>
            @php $index =1; @endphp
            @if(!empty($categoryrecords))
                @foreach($categoryrecords as $category)
                    <tr class="text-center">
                        <td class="fontSize15">{{$index}}</td>
                        <td class="fontSize15">{{$category['name']}}</td>
                        <td class="fontSize15">{{$category['type']}}</td>
                        <td class="fontSize15 text-center">
                            <a href="{{ route('category.show', ['categoryId' => $category['_id']]) }}" style="cursor: pointer;">
                                <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="{{trans('messages.Show')}}"></i></button>
                            </a>
                        </td>
                        <td class="fontSize15 text-center">
                            <a href="{{ route('category.edit', ['categoryId' => $category['_id'], ]) }}" style="cursor: pointer;">
                                <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="{{trans('messages.Edit')}}"></i></button>
                            </a>
                        </td>
                        <td class="fontSize15 text-center">
                            @if($category['status'] == 0)
                            <a href="{{ route('category.activestatus', ['categoryId' => $category['_id'], 'categoryStatus' =>1 ]) }}" style="cursor: pointer;">
                                <button class="btn btn-success align-text-top border-0"><i class="fa fa-unlock" title="{{trans('messages.Enable')}}"></i></button>
                            </a>
                            @else
                            <a href="{{ route('category.activestatus', ['categoryId' => $category['_id'], 'categoryStatus' =>0 ]) }}" style="cursor: pointer;">
                                <button class="btn btn-danger align-text-top border-0"><i class="fa fa-lock" title="{{trans('messages.Disable')}}"></i></button>
                            </a>
                            @endif
                        </td>
                    </tr>
                    @php $index++; @endphp
                @endforeach
            @else
            <tr>
                <td colspan="8">{{trans('messages.No records found')}}</td>
            </tr>
            @endif
        </tbody>
    </table>
    <div class="pagination-wrapper"> {!! $pagination->render() !!} </div>
</div>
</div>
@endsection