from functional_groups import functional_groups

def identify_functional_group(wavenumber):

    best_match = None
    smallest_distance = float("inf")

    for group, (low, high) in functional_groups.items():

        if low <= wavenumber <= high:

            center = (low + high) / 2
            distance = abs(wavenumber - center)

            if distance < smallest_distance:
                smallest_distance = distance
                best_match = group

    return best_match